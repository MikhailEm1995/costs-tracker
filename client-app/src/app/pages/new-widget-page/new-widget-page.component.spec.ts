import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewWidgetPageComponent } from './new-widget-page.component';

describe('NewWidgetPageComponent', () => {
  let component: NewWidgetPageComponent;
  let fixture: ComponentFixture<NewWidgetPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewWidgetPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewWidgetPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
