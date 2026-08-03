import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-tools-tray',
    templateUrl: './tools-tray.component.html',
    styleUrls: ['./tools-tray.component.scss'],
    standalone: false
})
export class ToolsTrayComponent {
  @Input() isDeleteMode = false;
  @Input() isEditMode = false;
  @Output() addLink = new EventEmitter<void>();
  @Output() reorderSections = new EventEmitter<void>();
  @Output() deleteMode = new EventEmitter<void>();
  @Output() editMode = new EventEmitter<void>();
  @Output() addSection = new EventEmitter<void>();
  @Output() deleteSection = new EventEmitter<void>();

  isOpen = false;

  toggleTray(): void {
    this.isOpen = !this.isOpen;
  }

  onAddLink(): void {
    this.addLink.emit();
    this.isOpen = false;
  }

  onReorderSections(): void {
    this.reorderSections.emit();
    this.isOpen = false;
  }

  onDeleteMode(): void {
    this.deleteMode.emit();
    this.isOpen = false;
  }

  onEditMode(): void {
    this.editMode.emit();
    this.isOpen = false;
  }

  onAddSection(): void {
    this.addSection.emit();
    this.isOpen = false;
  }

  onDeleteSection(): void {
    console.log('ToolsTray: onDeleteSection emitted');
    this.deleteSection.emit();
    this.isOpen = false;
  }
}
