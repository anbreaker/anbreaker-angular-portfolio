import { Location, NgTemplateOutlet } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { CvPageComponent } from './cv.page';

import { beforeEach, describe, expect, it, vi } from 'vitest';

@Component({ template: '' })
class StubPageComponent {}

const clickBack = async (harness: RouterTestingHarness): Promise<void> => {
  const button = harness.routeNativeElement?.querySelector<HTMLButtonElement>('.cv__back');

  expect(button?.textContent).toContain('Volver');
  button?.click();
  await harness.fixture.whenStable();
};

describe('CvPageComponent back button', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { component: StubPageComponent, path: '' },
          { component: StubPageComponent, path: 'about-me' },
          { component: CvPageComponent, path: 'cv' },
        ]),
      ],
    });
    // Nav and footer are not under test.
    TestBed.overrideComponent(CvPageComponent, {
      set: { imports: [NgTemplateOutlet], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
    });
  });

  it('goes back in history when the visitor came from another page of the site', async () => {
    const harness = await RouterTestingHarness.create('/about-me');
    await harness.navigateByUrl('/cv');
    const back = vi.spyOn(TestBed.inject(Location), 'back').mockImplementation(() => undefined);

    await clickBack(harness);

    expect(back).toHaveBeenCalledOnce();
    expect(TestBed.inject(Router).url).toBe('/cv');
  });

  it('goes to the home page when the CV was opened directly', async () => {
    const harness = await RouterTestingHarness.create('/cv');
    const back = vi.spyOn(TestBed.inject(Location), 'back');

    await clickBack(harness);

    expect(back).not.toHaveBeenCalled();
    expect(TestBed.inject(Router).url).toBe('/');
  });
});
