import { HttpClient } from "@angular/common/http";
import { TranslateLoader } from "@ngx-translate/core";
import { Observable, forkJoin, of } from "rxjs";
import { map, catchError, mergeAll } from "rxjs/operators";
import merge from "deepmerge";

// import "rxjs/add/observable/forkJoin";

// NEED THIS ?????
// export function translateLoader(http: HttpClient) {
//   return new MultiTranslateHttpLoader(http, [
//     { prefix: "./assets/i18n/", suffix: ".json" },
//     { prefix: "./assets/i18n/countries-", suffix: ".json" }
//   ]);
// }

export class MultiTranslateHttpLoader implements TranslateLoader {
  constructor(
    private http: HttpClient,
    public resources: { prefix: string; suffix: string }[] = [
      {
        prefix: "/assets/i18n/",
        suffix: ".json"
      }
    ]
  ) {}

  /**
   * Gets the translations from the server
   * @param lang
   * @returns {any}
   */
  public getTranslation(lang: string): any {
    // const requests = this.resources.map(resource => {
    //   const path = resource.prefix + lang + resource.suffix;
    //   return this.http.get(path).pipe(
    //     catchError(res => {
    //       console.error("Could not find translation file:", path);
    //       return of({});
    //     })
    //   );
    // });
    // return forkJoin(requests).pipe(map(response => merge.all(response)));

    return forkJoin(
      this.resources.map(config => {
        return this.http.get(`${config.prefix}${lang}${config.suffix}`);
      })
    ).pipe(
      map(response => {
        return response.reduce((a, b) => {
          return Object.assign(a, b);
        });
      })
    );
  }
}
