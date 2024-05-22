import {IDBPDatabase, openDB, deleteDB} from "idb";
import _ from "lodash";
import {useUiStore} from "src/stores/uiStore";
import {Suggestion, SuggestionState, SuggestionType} from "src/suggestions/models/Suggestion";

class IndexedDbSuggestionsPersistence {

  STORE_IDENT = "suggestions"

  private db: IDBPDatabase = null as unknown as IDBPDatabase

  async init() {
    console.log(" ...initializing suggestions IndexedDbStorage database")
    this.db = await this.initDatabase()
    useUiStore().dbReady = true
    return Promise.resolve("")
  }

  private async initDatabase(): Promise<IDBPDatabase> {
    console.debug(" about to initialize indexedDB (Suggestions)")
    const ctx = this
    return await openDB("suggestionsDB", 1, {
      // upgrading see https://stackoverflow.com/questions/50193906/create-index-on-already-existing-objectstore
      upgrade(db) {
        if (!db.objectStoreNames.contains(ctx.STORE_IDENT)) {
          console.log("creating db", ctx.STORE_IDENT)
          db.createObjectStore(ctx.STORE_IDENT);
        }
      }
    });
  }

  async getSuggestions(): Promise<Suggestion[]> {
    return this.db ? this.db.getAll('suggestions') : Promise.resolve([])
  }

  async addSuggestion(suggestion: Suggestion): Promise<void> {
    const suggestions = await this.getSuggestions()
    // console.log("%csuggestions from db", "color:red", suggestions)
    const foundAsNewDelayedOrIgnored = _.find(suggestions,
      (s: Suggestion) =>
        s.state === SuggestionState.NEW ||
        s.state === SuggestionState.IGNORED ||
        s.state === SuggestionState.DECISION_DELAYED)
    if (foundAsNewDelayedOrIgnored) { // && suggestion.state === SuggestionState.NEW) {
      if (foundAsNewDelayedOrIgnored.state === SuggestionState.IGNORED && suggestion.type === SuggestionType.RESTART) {
        console.log("setting existing restart suggestion to state NEW again")
        foundAsNewDelayedOrIgnored.state = SuggestionState.NEW
        this.db.put('suggestions', foundAsNewDelayedOrIgnored, foundAsNewDelayedOrIgnored.id)
        return Promise.resolve()
      }
      return Promise.reject(`there's already a suggestion in state ${foundAsNewDelayedOrIgnored.state}, not adding (now)`)
    }
    const found = _.find(suggestions, (s: Suggestion) => s.url === suggestion.url)
    if (!found) {
      await this.db.add('suggestions', suggestion, suggestion.id)
      return Promise.resolve()
    }
    return Promise.reject("suggestion already exists")
  }

  removeSuggestion(ident: string): Promise<any> {
    return this.db.delete('suggestions', ident)
  }

  async setSuggestionState(suggestionId: string, state: SuggestionState): Promise<Suggestion> {
    console.log("setting suggestion to state", suggestionId, state)
    const s: Suggestion = await this.db.get('suggestions', suggestionId)
    if (s) {
      s.state = state
      await this.db.put('suggestions', s, suggestionId)
      return Promise.resolve(s)
    }
    return Promise.reject("could not update suggestion")
  }


}

export default new IndexedDbSuggestionsPersistence()
