import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotWidgetComponent } from './plot-widget.component';

describe('PlotWidgetComponent', () => {
  let component: PlotWidgetComponent;
  let fixture: ComponentFixture<PlotWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlotWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
