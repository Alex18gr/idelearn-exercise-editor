import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodSelectDialogComponent } from './method-select-dialog.component';

describe('MethodSelectDialogComponent', () => {
  let component: MethodSelectDialogComponent;
  let fixture: ComponentFixture<MethodSelectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MethodSelectDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
