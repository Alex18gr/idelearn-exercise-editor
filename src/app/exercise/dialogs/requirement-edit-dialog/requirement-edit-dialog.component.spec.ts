import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementEditDialogComponent } from './requirement-edit-dialog.component';

describe('RequirementEditDialogComponent', () => {
  let component: RequirementEditDialogComponent;
  let fixture: ComponentFixture<RequirementEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequirementEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
