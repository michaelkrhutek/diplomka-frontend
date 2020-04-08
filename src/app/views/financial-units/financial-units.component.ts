import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FinancialUnitService } from 'src/app/services/financial-unit.service';
import { Observable, of } from 'rxjs';
import { ListItem, IListItem } from 'src/app/models/list-item';
import { map, tap, switchMap } from 'rxjs/operators';
import { IIconItem } from 'src/app/models/icon-item';
import { PopUpsService } from 'src/app/services/pop-ups.service';
import { SnackbarType } from 'src/app/models/snackbar-data';
import { Router } from '@angular/router';
import { BasicTile, IBasicTile, TileType, ClickableTile, IClickableTile } from 'src/app/models/tiles-models';
import { IConfirmationModalData } from 'src/app/models/confirmation-modal-data';

@Component({
  selector: 'app-financial-units',
  templateUrl: './financial-units.component.html',
  styleUrls: ['./financial-units.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancialUnitsComponent {

  constructor(
    private financialUnitService: FinancialUnitService,
    private popUpsService: PopUpsService,
    private router: Router
  ) { }

  readonly tileWidth: number = 12;
  readonly tileHeight: number = 8;

  isNewFinancialUnitModalOpened: boolean = false;
  isLoadingData: boolean = true;

  financialUnits$: Observable<IFinancialUnit[]> = this.financialUnitService.reloadFinancialUnits$.pipe(
    tap(() => (this.isLoadingData = true)),
    switchMap(() => this.financialUnitService.getFinancialUnits$())
  );

  tileItems$: Observable<(BasicTile | ClickableTile)[]> = this.financialUnits$.pipe(
    tap(v => console.log(v)),
    map((units: IFinancialUnit[]) => units.map((unit) => this.getTileItemFromUnit(unit))),
    tap(v => console.log(v)),
    map((tiles: BasicTile[]) => {
      const data: IClickableTile = {
        type: TileType.Clickable,
        iconName: 'add_circle',
        titleText: 'Nová jednotka',
        action: () => this.openNewFinancialUnitModal(),
        width: this.tileWidth,
        height: this.tileHeight
      };
      const newUnitTile: ClickableTile = new ClickableTile(data);
      return [newUnitTile, ...tiles];
    }),
    tap(() => (this.isLoadingData = false))
  );

  private getTileItemFromUnit(unit: IFinancialUnit): BasicTile {
    const data: IBasicTile = {
      type: TileType.Basic,
      titleText: unit.name,
      width: this.tileWidth,
      height: this.tileHeight,
      mainAction: () => {
        this.popUpsService.openLoadingModal({ message: 'Načítám účetní jednotku' });
        this.router.navigate(['financial-unit', unit._id]).finally(() => this.popUpsService.closeLoadingModal())
      },
      topRightActionItems$: of([
        {
          iconName: 'delete',
          description: 'Smazat',
          action: () => this.deleteUnit(unit)
        }
      ])
    };
    return new BasicTile(data);
  }

  deleteUnit(unit: IFinancialUnit): void {
    const data: IConfirmationModalData = {
      message: `Opravdu chcete smazat účetní jednotku ${unit.name}?`,
      action: () => this.financialUnitService.deleteFinancialUnit(unit._id)
    }
    this.popUpsService.openConfirmationModal(data);
  }

  openNewFinancialUnitModal(): void {
    this.isNewFinancialUnitModalOpened = true;
  }

  closeNewFinancialUnitModal(): void {
    this.isNewFinancialUnitModalOpened = false;
  }

  showSnackbar(): void {
    this.popUpsService.showSnackbar({ message: 'Snackbar works', type: SnackbarType.Success });
  }
}
