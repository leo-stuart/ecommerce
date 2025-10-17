import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

/**
 * Toast Service - Wrapper around ngx-toastr
 * 
 * Provides consistent, user-friendly notification messages throughout the application
 * Replaces browser alert(), confirm() with professional toast notifications
 */
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastr = inject(ToastrService);

  /**
   * Show success message
   */
  success(message: string, title: string = 'Success'): void {
    this.toastr.success(message, title);
  }

  /**
   * Show error message
   */
  error(message: string, title: string = 'Error'): void {
    this.toastr.error(message, title);
  }

  /**
   * Show warning message
   */
  warning(message: string, title: string = 'Warning'): void {
    this.toastr.warning(message, title);
  }

  /**
   * Show info message
   */
  info(message: string, title: string = 'Info'): void {
    this.toastr.info(message, title);
  }

  /**
   * Show confirmation toast with custom messages
   * Returns true for success scenarios (to be used after action is confirmed)
   */
  confirmSuccess(message: string, title: string = 'Confirmed'): void {
    this.toastr.success(message, title);
  }

  /**
   * Show deletion success message
   */
  deleteSuccess(itemName: string = 'Item'): void {
    this.success(`${itemName} deleted successfully`);
  }

  /**
   * Show creation success message
   */
  createSuccess(itemName: string = 'Item'): void {
    this.success(`${itemName} created successfully`);
  }

  /**
   * Show update success message
   */
  updateSuccess(itemName: string = 'Item'): void {
    this.success(`${itemName} updated successfully`);
  }

  /**
   * Show generic operation failed message
   */
  operationFailed(operation: string = 'Operation'): void {
    this.error(`${operation} failed. Please try again.`);
  }

  /**
   * Show network error message
   */
  networkError(): void {
    this.error('Network error. Please check your connection.', 'Connection Error');
  }

  /**
   * Show validation error message
   */
  validationError(message: string = 'Please check your input and try again.'): void {
    this.error(message, 'Validation Error');
  }

  /**
   * Show unauthorized access message
   */
  unauthorized(): void {
    this.error('You are not authorized to perform this action.', 'Unauthorized');
  }

  /**
   * Clear all toasts
   */
  clearAll(): void {
    this.toastr.clear();
  }
}

