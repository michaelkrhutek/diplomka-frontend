import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, switchMap, tap, debounceTime, startWith, shareReplay } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { BasicTable } from './basic-table-models';

export class PaginatedTable<DataType, FilteringCriteria> {

    // Page sizes
    pageSizes: number[] = [5, 10, 20];

    // Page index stream
    private pageIndexSource: BehaviorSubject<number> = new BehaviorSubject<number>(1);
    pageIndex$: Observable<number> = this.pageIndexSource.asObservable();

    // Page size stream
    private pageSizeFC: FormControl = new FormControl(this.pageSizes[1]);
    pageSize$: Observable<number> = this.pageSizeFC.valueChanges.pipe(startWith(this.pageSizeFC.value));

    // Is loading stream
    private isLoadingDataSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    isLoadingData$: Observable<boolean> = this.isLoadingDataSource.asObservable();

    // List items and Total items count streams
    tableData$: Observable<BasicTable>;
    totalItemsCount$: Observable<number>;
     
    // Other streams
    maximalPageIndex$: Observable<number>;
    canBeNextPageSelected$: Observable<boolean>;
    canBePreviousPageSelected$: Observable<boolean>;
    //canBePageChange$: Observable<boolean>;
    firstLastAndTotalItemIndexes$: Observable<[number, number, number]>

    lastFilteringCriteria: FilteringCriteria = null;
    lastPageSize: number = null;

    constructor(
        filteringCriteria$: Observable<FilteringCriteria>,
        getRecords$: (fc: FilteringCriteria, pageIndex: number, pageSize: number) => Observable<DataType[]>,
        tableDataMapper: (records: DataType[]) => BasicTable,
        getTotalItemsCount$: (fc: FilteringCriteria, pageIndex: number, pageSize: number) => Observable<number>
    ) {
        this.assignAllObservables(filteringCriteria$, getRecords$, tableDataMapper, getTotalItemsCount$);
    }

    // Get allCriteria$ observable method
    private getAllCriteria$(
        filteringCriteria$: Observable<FilteringCriteria>,
        pageIndex$: Observable<number>,
        pageSize$: Observable<number>
    ): Observable<IAllCriteria<FilteringCriteria>> {
        return combineLatest(filteringCriteria$, pageIndex$, pageSize$).pipe(
            map(([filteringCriteria, pageIndex, pageSize]) => {
                const allCriteria: IAllCriteria<FilteringCriteria> = { filteringCriteria, pageIndex, pageSize };
                return allCriteria
            })
        );
    }

    // Assigning all observables
    private assignAllObservables(
        filteringCriteria$: Observable<FilteringCriteria>,
        getRecords$: (fc: FilteringCriteria, pageIndex: number, pageSize: number) => Observable<DataType[]>,
        tableDataMapper: (items: DataType[]) => BasicTable,
        getTotalItemsCount$: (fc: FilteringCriteria, pageIndex: number, pageSize: number) => Observable<number>
    ): void {
        const filteringCriteriaUpdatingPageIndex$: Observable<FilteringCriteria> = filteringCriteria$.pipe(
            debounceTime(400),
            tap(() => this.pageIndexSource.value != 1 && this.pageIndexSource.next(1))
        );
        const pageSizeUpdatingPageIndex$: Observable<number> = this.pageSize$.pipe(
            tap(() => this.pageIndexSource.value != 1 && this.pageIndexSource.next(1))
        );
        const allCriteria$: Observable<IAllCriteria<FilteringCriteria>> = this.getAllCriteria$(filteringCriteriaUpdatingPageIndex$, this.pageIndex$, pageSizeUpdatingPageIndex$);
        const itemsAndTotalItemsCountZip$: Observable<[number, DataType[]]> = this.getItemsAndTotalItemsCountZip$(this.isLoadingDataSource, allCriteria$, getRecords$, getTotalItemsCount$);
        this.tableData$ = itemsAndTotalItemsCountZip$.pipe(
            map(([totalItemsCount, records]: [number, DataType[]]) => tableDataMapper(records)),
            startWith(null)
        );
        this.totalItemsCount$ = itemsAndTotalItemsCountZip$.pipe(
            map(([totalItemsCount, records]: [number, DataType[]]) => totalItemsCount),
            startWith(0)
        );
        this.maximalPageIndex$ = this.getMaximalPageIndex$(this.totalItemsCount$, this.pageSize$)
        this.firstLastAndTotalItemIndexes$ = this.getFirstAndLastItemIndexes$(this.pageIndex$, this.pageSize$, this.totalItemsCount$);
        this.canBeNextPageSelected$ = this.getCanBeNextPageSelected$(this.pageIndex$, this.maximalPageIndex$)
        this.canBePreviousPageSelected$ = this.getCanBePreviousPageSelected$(this.pageIndex$)
    }

    // Get ListItemDatasAndTotalItemsCountZip$ observable method
    private getItemsAndTotalItemsCountZip$(
        isLoadingDataSource: BehaviorSubject<boolean>,
        allCriteria$: Observable<IAllCriteria<FilteringCriteria>>,
        getRecords$: (fc: FilteringCriteria, pageIndex: number, pageSize: number) => Observable<DataType[]>,
        getTotalItemsCount$: (fc: FilteringCriteria, pageIndex: number, pageSize: number) => Observable<number>
    ): Observable<[number, DataType[]]> {
        return allCriteria$.pipe(
            tap(() => isLoadingDataSource.next(true)),
            debounceTime(10),
            switchMap((allCriteria: IAllCriteria<FilteringCriteria>) => {
                const items$: Observable<DataType[]> = getRecords$(allCriteria.filteringCriteria, allCriteria.pageIndex, allCriteria.pageSize);
                const totalItemsCount$: Observable<number> = getTotalItemsCount$(allCriteria.filteringCriteria, allCriteria.pageIndex, allCriteria.pageIndex);
                return combineLatest(totalItemsCount$, items$);
            }),
            tap(() => isLoadingDataSource.next(false)),
            shareReplay(1)
        );
    }

    // Get firstAndLastItemIndexes$ observable method
    private getFirstAndLastItemIndexes$(pageIndex$: Observable<number>, pageSize$: Observable<number>, totalItemsCount$: Observable<number>): Observable<[number, number, number]> {
        return combineLatest(pageIndex$, pageSize$, totalItemsCount$).pipe(
            map(([pageIndex, pageSize, totalItemsCount]) => {
                const firstItemIndex: number = (pageIndex - 1) * this.pageSizeFC.value + 1;
                const lastItemIndex: number = pageIndex * this.pageSizeFC.value;
                return [firstItemIndex, lastItemIndex < totalItemsCount ? lastItemIndex : totalItemsCount, totalItemsCount];
            })
        );
    }

    // Get maximalPageIndex$ observable method
    private getMaximalPageIndex$(totalItemsCount$: Observable<number>, pageSize$: Observable<number>): Observable<number> {
        return combineLatest(totalItemsCount$, pageSize$).pipe(
            map(([totalItemsCount, pageSize]: [number, number]) => Math.ceil(totalItemsCount / this.pageSizeFC.value)),
            startWith(1)
        );
    }

    // Get canBeNextPageSelected$ observable method
    private getCanBeNextPageSelected$(pageIndex$: Observable<number>, maximalPageIndex$: Observable<number>): Observable<boolean> {
        return combineLatest(pageIndex$, maximalPageIndex$).pipe(
            map(([pageIndex, maximalPageIndex]: [number, number]) => pageIndex < maximalPageIndex),
            shareReplay(1)
        );
    }

    // Get canBePreviousPageSelected$ observable method
    private getCanBePreviousPageSelected$(pageIndex$: Observable<number>): Observable<boolean> {
        return pageIndex$.pipe(
            map((pageIndex: number) => pageIndex > 1),
            shareReplay(1)
        );
    }

    // Change pageIndex method
    changePageIndex(pageIndex: number): void {
        this.pageIndexSource.next(pageIndex);
    }

    // Change pageSize method
    changePageSize(pageSize: number): void {
        this.pageSizeFC.patchValue(pageSize);
    }

    // Reload data
    reloadData(): void {
        this.changePageIndex(1);
    }
}



// All criteria interface
interface IAllCriteria<FilteringCriteria> {
    filteringCriteria: FilteringCriteria;
    pageIndex: number;
    pageSize: number;
}
