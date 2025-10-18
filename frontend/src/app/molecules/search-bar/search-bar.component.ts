import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  template: `
    <div class="search-bar relative">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <input
          type="search"
          [placeholder]="placeholder"
          [value]="searchTerm"
          (input)="onSearchChange($event.target.value)"
          class="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
        />
        
        <button
          *ngIf="searchTerm && showClearButton"
          type="button"
          (click)="onClear()"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div *ngIf="showButton" class="mt-3">
        <app-button
          variant="primary"
          [fullWidth]="true"
          (clicked)="onSearch()"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {{ buttonText }}
        </app-button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class SearchBarComponent {
  @Input() placeholder = 'Search...';
  @Input() buttonText = 'Search';
  @Input() showButton = false; // If false, search is triggered on input
  @Input() showClearButton = true;
  @Input() debounceTime = 300; // Debounce time in milliseconds
  
  @Output() search = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();
  
  searchTerm: string | number = '';
  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    // Set up debounced search
    this.searchSubject
      .pipe(debounceTime(this.debounceTime))
      .subscribe((term) => {
        this.search.emit(term);
      });
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  onSearchChange(value: string | number): void {
    const term = String(value);
    this.searchTerm = term;
    
    if (!this.showButton) {
      // Auto-search with debounce
      this.searchSubject.next(term);
    }
  }

  onSearch(): void {
    this.search.emit(String(this.searchTerm));
  }

  onClear(): void {
    this.searchTerm = '';
    this.searchSubject.next('');
    this.clear.emit();
  }
}

