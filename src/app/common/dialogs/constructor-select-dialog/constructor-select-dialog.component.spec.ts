import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructorSelectDialogComponent } from './constructor-select-dialog.component';

describe('ConstructorSelectDialogComponent', () => {
  let component: ConstructorSelectDialogComponent;
  let fixture: ComponentFixture<ConstructorSelectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstructorSelectDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
