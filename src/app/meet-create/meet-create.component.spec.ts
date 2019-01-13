import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetCreateComponent } from './meet-create.component';

describe('MeetCreateComponent', () => {
  let component: MeetCreateComponent;
  let fixture: ComponentFixture<MeetCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
