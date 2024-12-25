import Command from 'src/core/domain/Command'
import { ExecutionResult } from 'src/core/domain/ExecutionResult'
import { useUtils } from 'src/core/services/Utils'
import { Suggestion, SuggestionState } from 'src/suggestions/models/Suggestion'
import { useSuggestionsStore } from 'src/suggestions/stores/suggestionsStore'

const { sendMsg } = useUtils()

export class IgnoreSuggestionCommand implements Command<any> {
  constructor(public suggestion: Suggestion) {}

  async execute(): Promise<ExecutionResult<any>> {
    return useSuggestionsStore()
      .updateSuggestionState(this.suggestion.id, SuggestionState.IGNORED)
      .then(() => {
        sendMsg('reload-suggestions', {})
      })
      .then(() => {
        return Promise.resolve(new ExecutionResult('', 'The suggestion has been ignored'))
      })
      .catch((err) => {
        return Promise.reject('Problem applying suggestion: ' + err)
      })
  }
}

IgnoreSuggestionCommand.prototype.toString = function cmdToString() {
  return `IgnoreSuggestionCommand: {suggestion=${this.suggestion.toString()}}`
}
