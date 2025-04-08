import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencyFormatPipe } from '../../utils/pipes/currency-format.pipe';
import { CurrentDateComponent } from '../../../core/components/current-date/current-date.component';

@Component({
  selector: 'app-budget-bar',
  imports: [
    CommonModule,
    CurrencyFormatPipe,
    TranslateModule
  ],
  templateUrl: './budget-bar.component.html',
  styleUrl: './budget-bar.component.css'
})
export class BudgetBarComponent {
  @Input({ required: true })
  spend!: number;
  @Input({ required: true })
  budget!: number;
  @Input({ required: true })
  overspend!: number;
  @Input({ required: true })
  remaining!: number;
  @Input()
  date!: Date | undefined;
  @Input()
  hideDecimals: boolean = false;
  weekLines: number[] = [];
  @Input()
  typeMonthOrYear: string = 'month';

  getPercentageSpend(spend: number, budget: number): number {
    return budget === 0 ? 0 : spend * 100 / budget;
  }

  getClassBasedOnPercentage(percentage: number): string {
    if (percentage <= this.getCurrPercentageOfMonth()) {
      return '';
    } else if (percentage <= 100 && percentage > this.getCurrPercentageOfMonth()){
      return 'warning';
    }

    return 'danger';
  }

  getTextBasedOnPercentage(percentage: number): string {
    if(percentage <= this.getCurrPercentageOfMonth()){
      return '';
    }else if(percentage <= 100 && percentage > this.getCurrPercentageOfMonth()){
      return 'RiskOverspend';
    }

    return 'Overspend';
  }

  getClassToProgressBar(percentage: number): string {
    if(percentage <= this.getCurrPercentageOfMonth()){
      return 'bg-info';
    }else if(percentage <= 100 && percentage > this.getCurrPercentageOfMonth()){
      return 'bg-warning';
    }

    return 'bg-danger';
  }
  getCurrPercentageOfMonth():number{
    var today = new Date();
    return today ? (today.getDate() / new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()) * 100 : 0;
  }
  getWeeksInCurrentMonth(): number {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const daysInMonth = end.getDate();

    // Week starts on Sunday (0)
    const startDay = start.getDay();
    const totalWeeks = Math.ceil((startDay + daysInMonth) / 7);

    return totalWeeks;
  }

  ngOnInit(): void {
  if (this.checkIfCurrentMonth()) {
    const weeks = this.getWeeksInCurrentMonth();
    this.weekLines = Array.from({ length: weeks - 1 }, (_, i) => ((i + 1) / weeks) * 100);
    }
  }

  checkIfCurrentMonth(): boolean {
    var today = new Date();
    return this.typeMonthOrYear=="month" && today.getMonth()  == CurrentDateComponent.currentDate.getMonth() && today.getFullYear() == CurrentDateComponent.currentDate.getFullYear();
  }

  checktypeMonthOrYear(): string {
    return this.typeMonthOrYear;
  }
}
