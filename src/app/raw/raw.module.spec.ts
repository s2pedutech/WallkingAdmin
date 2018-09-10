import { RawModule } from './raw.module';

describe('RawModule', () => {
  let rawModule: RawModule;

  beforeEach(() => {
    rawModule = new RawModule();
  });

  it('should create an instance', () => {
    expect(rawModule).toBeTruthy();
  });
});
