import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubRequirementEditDialogComponent } from './sub-requirement-edit-dialog.component';

describe('SubRequirementEditDialogComponent', () => {
  let component: SubRequirementEditDialogComponent;
  let fixture: ComponentFixture<SubRequirementEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubRequirementEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubRequirementEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
