import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { InputComponent } from '../../atoms/input/input.component';
import { ButtonComponent } from '../../atoms/button/button.component';

/**
 * SearchBar Molecule - Atomic Design Level 2
 * Combines Input + Button atoms for search functionality
 * 
 * Characteristics:
 * - Combination of Input and Button atoms
 * - Serves a single purpose (search)
 * - Reusable across pages
 * - Under 150 lines
 * - Simple interaction logic (debounced search)
 */
@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, ButtonComponent],
  template: `
    <div class="search-bar flex gap-2">
      <div class="flex-1">
        <app-input
          type="search"
          [placeholder]="placeholder"
          [value]="searchTerm"
          (valueChange)="onSearchChange($event)"
        />
      </div>
      
      <app-button
        *ngIf="showButton"
        variant="primary"
        (clicked)="onSearch()"
      >
        <span>{{ buttonText }}</span>
      </app-button>
      
      <app-button
        *ngIf="searchTerm && showClearButton"
        variant="secondary"
        (clicked)="onClear()"
      >
        Clear
      </app-button>
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

