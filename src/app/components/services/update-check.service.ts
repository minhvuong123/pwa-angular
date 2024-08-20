import { ApplicationRef, Injectable } from "@angular/core";
import { SwUpdate } from "@angular/service-worker";
import { concat, first, interval } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class UpdateCheckService {
	constructor(
    private appRef: ApplicationRef, 
    private swUpdate: SwUpdate
  ) {}

  checkForUpdate() {
    const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
    const everyTwoMinutes$ = interval(2 * 60 * 1000);
    const everyTwoMinutesOnceAppIsStable$ = concat(appIsStable$, everyTwoMinutes$);

    everyTwoMinutesOnceAppIsStable$.subscribe(async () => {
      try {
        const updateFound = await this.swUpdate.checkForUpdate();
        console.log(updateFound ? 'A new version is available.' : 'Already on the latest version.');
      } catch (err) {
        console.error('Failed to check for updates:', err);
      }
    });
  }
}