import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { MatDividerModule } from '@angular/material/divider';


@NgModule({

    imports: [
        MatButtonModule,
        MatInputModule,
        MatCheckboxModule,
        MatIconModule,
        MatTooltipModule,
        MatSidenavModule,
        MatMenuModule,
        MatDialogModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDividerModule,
    ],
    exports: [
        MatButtonModule,
        MatInputModule,
        MatCheckboxModule,
        MatIconModule,
        MatTooltipModule,
        MatSidenavModule,
        MatMenuModule,
        MatDialogModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDividerModule,

    ]

})

export class MaterialModule { }