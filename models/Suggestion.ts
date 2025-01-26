import _ from 'lodash'

export type SuggestionState =
  | 'NEW'
  | 'IGNORED'
  | 'APPLIED'
  | 'CHECKED'
  | 'DECISION_DELAYED'
  | 'INACTIVE'
  | 'NOTIFICATION'

export type SuggestionType =
  | 'RSS'
  | 'REDIRECT_HAPPENED_FOR_TAB'
  | 'REDIRECT_HAPPENED_FOR_BOOKMARK'
  | 'CONTENT_CHANGE'
  | 'FEATURE'
  | 'URL'
  | 'RESTART'
  | 'TABSET_SHARED'
  | 'USE_EXTENSION'

export type StaticSuggestionIdent =
  | 'TRY_TAB_DETAILS_FEATURE'
  | 'TRY_BOOKMARKS_FEATURE'
  | 'TRY_SPACES_FEATURE'
  | 'TRY_NEWEST_TABS_FEATURE'
  | 'RELEASE_NOTES_AVAILABLE'
  | 'RESTART_SUGGESTED'
  | 'USE_EXTENSION_SUGGESTION'

export class Suggestion {
  public state: SuggestionState
  public img: string | undefined = undefined
  public data: object = {}
  public created: number | undefined = undefined

  static staticSuggestions: Suggestion[] = [
    new Suggestion(
      'TRY_BOOKMARKS_FEATURE',
      'Want to try a new feature?',
      "Maybe you want to try the optional 'Bookmarks' feature?",
      '/features/bookmarks',
      'FEATURE',
    ).setImage('o_bookmarks'),
    new Suggestion(
      'TRY_SPACES_FEATURE',
      'Want to try a new feature?',
      "Check out the optional 'Spaces' feature and get another level of organization",
      '/features/spaces',
      'FEATURE',
    ).setImage('o_space_dashboard'),
    new Suggestion(
      'TRY_NEWEST_TABS_FEATURE',
      'Want to try a new feature?',
      'Activate a view with your latest tabs',
      '/features/newest_tabs',
      'FEATURE',
    ).setImage('o_schedule'),
    // new Suggestion(StaticSuggestionIdent.RELEASE_NOTES_AVAILABLE,
    //   "Version was updated",
    //   "Do you want to read the release notes?",
    //   RELEASE_NOTES_URL,
    //   SuggestionType.URL)
    //   .setImage('o_schedule'),
    new Suggestion(
      'RESTART_SUGGESTED',
      'Restart Required',
      'Please restart tabsets by clicking the button',
      '',
      'RESTART',
    ).setImage('o_schedule'),
    new Suggestion(
      'USE_EXTENSION_SUGGESTION',
      'Check out Tabsets Extension',
      'Tabsets Browser Extension will provide many more features and integrations',
      'https://docs.tabsets.net',
      'URL',
    ).setImage('o_extension'),
  ]

  constructor(
    public id: string, // could be random, could be an encoded URL or a predefined string ("TRY Feature X")
    public title: string,
    public msg: string,
    public url: string,
    public type: SuggestionType = 'RSS',
  ) {
    this.state = 'NEW'
    this.created = new Date().getTime()
  }

  setImage(img: string): Suggestion {
    this.img = img
    return this
  }

  setData(data: object): Suggestion {
    this.data = data
    return this
  }

  static getStaticSuggestion(ident: StaticSuggestionIdent): Suggestion | undefined {
    return _.find(this.staticSuggestions, (s: any) => s.id === ident)
  }
}
