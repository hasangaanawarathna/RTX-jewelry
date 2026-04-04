import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignRequest } from './design-request';

describe('DesignRequest', () => {
  let component: DesignRequest;
  let fixture: ComponentFixture<DesignRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignRequest],
    }).compileComponents();

    fixture = TestBed.createComponent(DesignRequest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
