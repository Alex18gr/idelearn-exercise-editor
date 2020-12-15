import { Component, ElementRef, HostBinding, HostListener, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileUploadComponent,
      multi: true
    }
  ]
})
export class FileUploadComponent implements ControlValueAccessor {
  @ViewChild('fileInput') fileInput!: ElementRef;

  file: File | null = null;
  onChange: Function | undefined;
  @HostBinding('class.fileover') fileOver!: boolean;

  @HostListener('dragover', ['$event'])
  onDragOver(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = false;
    const files = (event as any).dataTransfer.files
    if (this.onChange && files.length === 1) {
      this.file = files.item(0);
      this.onChange(this.file?.path);
    }
  }

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    const file = event && event.item(0);
    this.file = file;
    if (this.onChange) {
      this.onChange(this.file?.path);
    }
  }

  choseFile() {
    this.fileInput.nativeElement.click();
  }

  constructor(private host: ElementRef<HTMLInputElement>) {
  }

  writeValue(obj: any): void {
    // clear file input
    this.host.nativeElement.value = '';
    this.file = null;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {

  }
}
