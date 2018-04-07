import { TestBed, inject } from '@angular/core/testing';

import { UserCategoriesService } from './user-categories.service';

describe('UserCategoriesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserCategoriesService]
    });
  });

  it('should be created', inject([UserCategoriesService], (service: UserCategoriesService) => {
    expect(service).toBeTruthy();
  }));
});
