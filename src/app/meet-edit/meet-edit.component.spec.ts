import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetEditComponent } from './meet-edit.component';

describe('MeetEditComponent', () => {
  let component: MeetEditComponent;
  let fixture: ComponentFixture<MeetEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
