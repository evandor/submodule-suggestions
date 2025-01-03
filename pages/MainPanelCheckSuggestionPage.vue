<template>
  <!-- toolbar -->
  <q-toolbar class="text-primary">
    <q-toolbar-title>
      {{ suggestion?.state === SuggestionState.NOTIFICATION || suggestion?.url ? 'Notification' : 'Suggestion' }}
    </q-toolbar-title>
  </q-toolbar>

  <div class="q-pa-md q-gutter-sm">
    <!--    <q-banner rounded >-->
    <!--      Suggestions Info text: TODO-->
    <!--    </q-banner>-->

    <div class="row items-baseline q-ma-md">
      <div class="col-2 text-bold">Title</div>
      <div class="col">
        {{ suggestion?.title }}
      </div>
    </div>

    <div class="row q-mt-none q-pt-none q-ma-md">
      <div class="col-2 text-bold">&nbsp;</div>
      <div class="col text-caption text-grey">
        {{ date.formatDate(suggestion?.created, 'DD.MM.YYYY HH:mm') }}
      </div>
    </div>

    <div class="row items-baseline q-mx-md q-my-xs">
      <div class="col-2 text-caption">Messsage</div>
      <div class="col">
        {{ suggestion?.msg }}
      </div>
    </div>

    <div class="row items-baseline q-ma-md" v-if="suggestion?.data['url' as keyof object]">
      <div class="col-2">URL</div>
      <div class="col text-blue cursor-pointer">
        <div @click="NavigationService.openOrCreateTab([suggestion?.data['url' as keyof object]])">
          {{ suggestion?.data['url' as keyof object] }}
        </div>
      </div>
    </div>

    <!--    <div class="row items-baseline q-ma-md" v-if="suggestion?.type === SuggestionType.RESTART">-->
    <!--      <div class="col-2 ">-->

    <!--      </div>-->
    <!--      <div class="col text-blue cursor-pointer">-->
    <!--        <q-btn label="Restart" @click="restart()"/>-->
    <!--      </div>-->
    <!--    </div>-->

    <template
      v-if="
        suggestion?.type?.toUpperCase() === 'REDIRECT_HAPPENED_FOR_BOOKMARK' ||
        suggestion?.type?.toUpperCase() === 'REDIRECT_HAPPENED_FOR_TAB'
      ">
      <div class="row items-baseline q-ma-md">
        <div class="col-2">Got Response Code</div>
        <div class="col">
          {{ suggestion?.data['status' as keyof object] }}
        </div>
        <div class="col-12 text-bold q-my-lg">Suggestion:</div>
        <div class="col-2">Replace</div>
        <div class="col-10">
          {{ suggestion?.data['url' as keyof object] }}
        </div>
        <div class="col-2">with</div>
        <div class="col-10">
          {{ suggestion?.data['location' as keyof object] }}
        </div>
      </div>

      <div class="row items-baseline q-ma-md">
        <div class="col-2 text-bold">&nbsp;</div>
        <div class="col">
          <template v-if="!decided">
            <q-btn label="Ignore" class="q-mr-md" size="sm" @click="ignoreSuggestion()">
              <q-tooltip class="tooltip-small" :delay="500">Ignore this suggestion</q-tooltip>
            </q-btn>
            <q-btn label="Apply Suggestion" size="sm" color="warning" @click="applySuggestion"></q-btn>
          </template>
          <template v-else>
            <q-btn label="Close Window" class="q-mr-md" size="sm" @click="closeWindow()" />
          </template>
        </div>
      </div>
    </template>

    <!--    <template v-if="suggestion?.type === SuggestionType.CONTENT_CHANGE">-->

    <!--      <div class="row items-baseline q-ma-md">-->
    <!--        <div class="col-2 text-bold">-->

    <!--        </div>-->
    <!--        <div class="col">-->

    <!--          <template v-if="!decided">-->
    <!--&lt;!&ndash;            <q-btn v-if="isMonitoring()" label="Stop Monitoring" class="q-mr-md" size="sm" @click="stopMonitoring()">&ndash;&gt;-->
    <!--&lt;!&ndash;              <q-tooltip class="tooltip-small" :delay="500">Stop Monitoring this website</q-tooltip>&ndash;&gt;-->
    <!--&lt;!&ndash;            </q-btn>&ndash;&gt;-->
    <!--            <q-btn label="Reset Monitoring" class="q-mr-md"-->
    <!--                   size="sm" color="warning" @click="applySuggestion"></q-btn>-->
    <!--            <q-btn v-if="pngs.length === 1"-->
    <!--                   label="Compare with Current" class="q-mr-md"-->
    <!--                   size="sm" color="positive" @click="createImageToCompare()"></q-btn>-->
    <!--&lt;!&ndash;            <q-btn label="Delete Notification" class="q-mr-md"&ndash;&gt;-->
    <!--&lt;!&ndash;                   size="sm" color="negative" @click="deleteNotification"></q-btn>&ndash;&gt;-->
    <!--          </template>-->
    <!--          <template v-else>-->
    <!--            <q-btn label="Close Window" class="q-mr-md" size="sm" @click="closeWindow()"/>-->
    <!--          </template>-->
    <!--        </div>-->
    <!--      </div>-->

    <!--      <div class="row" v-show="pngs.length === 1">-->
    <!--        <div class="col-12 q-pr-xs">-->
    <!--          Snapshot when Monitoring started<br>-->
    <!--          <q-scroll-area style="height: 630px; width:100%;"-->
    <!--                         visible-->
    <!--                         :thumb-style="thumbStyle"-->
    <!--                         :bar-style="barStyle"-->
    <!--                         class="col">-->
    <!--            <div class="row no-wrap">-->
    <!--              <img id="monitoringStartSingleImg">-->
    <!--            </div>-->
    <!--          </q-scroll-area>-->

    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="row" v-show="pngs.length > 1">-->
    <!--        <div class="col-4 q-pr-xs">-->
    <!--          <q-scroll-area style="height: 630px; width:100%;"-->
    <!--                         visible-->
    <!--                         :thumb-style="thumbStyle"-->
    <!--                         :bar-style="barStyle"-->
    <!--                         class="col"-->
    <!--                         ref="firstRef"-->
    <!--                         @scroll="onScrollFirst">-->
    <!--            <div class="row no-wrap">-->
    <!--              <img id="monitoringStartImg">-->
    <!--            </div>-->
    <!--          </q-scroll-area>-->
    <!--        </div>-->
    <!--        <div class="col-4">-->
    <!--          <q-scroll-area-->
    <!--            visible-->
    <!--            :thumb-style="thumbStyle"-->
    <!--            :bar-style="barStyle"-->
    <!--            style="height: 100%"-->
    <!--            class="col"-->
    <!--            ref="secondRef"-->
    <!--            @scroll="onScrollSecond">-->
    <!--            <div class="row no-wrap">-->
    <!--              <img id="monitoringSnapshotImg">-->
    <!--            </div>-->
    <!--          </q-scroll-area>-->
    <!--        </div>-->
    <!--        <div class="col-4">-->
    <!--          <q-scroll-area-->
    <!--            visible-->
    <!--            :thumb-style="thumbStyle"-->
    <!--            :bar-style="barStyle"-->
    <!--            style="height: 100%"-->
    <!--            class="col"-->
    <!--            ref="thirdRef"-->
    <!--            @scroll="onScrollThird">-->
    <!--            <div class="row no-wrap">-->
    <!--              <canvas id="diffCanvas"/>-->
    <!--            </div>-->
    <!--          </q-scroll-area>-->

    <!--        </div>-->
    <!--      </div>-->

    <!--    </template>-->
  </div>
</template>

<script lang="ts" setup>
// import PdfService from "src/snapshots/services/PdfService";
// import ContentUtils from "src/core/utils/ContentUtils";
// import {SavedBlob} from "src/models/SavedBlob";
// import pixelmatch from "pixelmatch";
import { PNG } from 'pngjs/browser'
import { date } from 'quasar'
import { useCommandExecutor } from 'src/core/services/CommandExecutor'
// import {PNGWithMetadata} from "pngjs";
import { NotificationType } from 'src/core/services/ErrorHandler'
import Analytics from 'src/core/utils/google-analytics'
import NavigationService from 'src/services/NavigationService'
import { ApplySuggestionCommand } from 'src/suggestions/commands/ApplySuggestionCommand'
import { IgnoreSuggestionCommand } from 'src/suggestions/commands/IgnoreSuggestionCommand'
import { Suggestion, SuggestionState, SuggestionType } from 'src/suggestions/models/Suggestion'
import { useSuggestionsStore } from 'src/suggestions/stores/suggestionsStore'
import { onMounted, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const suggestionId = ref<string | undefined>(undefined)
const suggestion = ref<Suggestion | undefined>(undefined)
// const pngs = ref<SavedBlob[]>([])
const decided = ref(false)
const diff = ref<PNG | undefined>(undefined)

onMounted(() => {
  Analytics.firePageViewEvent('MainPanelCheckSuggestionPage', document.location.href)
})

watchEffect(() => {
  if (diff.value) {
    console.log('got diff', diff)
  }
})

watchEffect(async () => {
  suggestionId.value = route.params.suggestionId as string
  if (suggestionId.value) {
    suggestion.value = useSuggestionsStore().getSuggestion(suggestionId.value) as Suggestion
    console.log('got suggestion', suggestion.value)
    if (suggestion.value && suggestion.value.type === SuggestionType.CONTENT_CHANGE) {
      const tabId = suggestion.value['data' as keyof object]['tabId' as keyof object]
      console.log('got tabId', tabId)
      // pngs.value = await PdfService.getPngsForTab(tabId)
      // console.log("pngs", pngs.value)
      // if (pngs.value.length > 0) {
      //   var urlCreator = window.URL || window.webkitURL;
      //   var imageUrl = urlCreator.createObjectURL(pngs.value[0].content);
      //   console.log("imageUrl", imageUrl)
      //   createImage(imageUrl, "#monitoringStartSingleImg");
      //   createImage(imageUrl, "#monitoringStartImg");
      //
      //   if (pngs.value.length > 1) {
      //     var imageUrl2 = urlCreator.createObjectURL(pngs.value[1].content);
      //     console.log("imageUrl2", imageUrl2)
      //     const img2: HTMLImageElement | null = document.querySelector("#monitoringSnapshotImg")
      //     if (img2) {
      //       img2.src = imageUrl2;
      //       img2.onload = function () {
      //         var w = img2.width;
      //         var h = img2.height;
      //         console.log("NEW IMAGE width2", w);
      //         console.log("NEW IMAGE height2: ", h);
      //
      //
      //         // const img1 = img1Context.getImageData(0, 0, width, height);
      //         // const img2 = img2Context.getImageData(0, 0, width, height);
      //         // const diff = diffContext.createImageData(width, height);
      //         //const buf1: Buffer = img1?.get
      //         //const myMat: Mat = new Mat(buf, height, width, CV_8UC4);
      //         const content1: Blob = pngs.value[0].content as Blob
      //         const content2: Blob = pngs.value[1].content as Blob
      //         content1.arrayBuffer()
      //           .then((buf1: ArrayBuffer) => {
      //             //console.log("got buf1", ArrayBuffer.isView(buf1))
      //             //console.log("got buf1", ArrayBuffer.isView(buf1), buf1.constructor.BYTES_PER_ELEMENT === 1)
      //             content2.arrayBuffer()
      //               .then((buf2: ArrayBuffer) => {
      //
      //                 const beforeImg: PNGWithMetadata = PNG.sync.read(Buffer.from(buf1))
      //                 let afterImg = PNG.sync.read(Buffer.from(buf2))
      //
      //                 console.log("beforeImg:", beforeImg.width, beforeImg.height)
      //                 console.log("afterImg: ", afterImg.width, afterImg.height)
      //
      //                 const width = beforeImg.width
      //                 const height = beforeImg.height
      //
      //                 if (afterImg.height > beforeImg.height) { // assuming width is the same
      //                   //ctx?.createImageData(width, height);
      //                   let newfile = new PNG({width, height});
      //                   for (let y = 0; y < newfile.height; y++) {
      //                     for (let x = 0; x < newfile.width; x++) {
      //                       let idx = (newfile.width * y + x) << 2;
      //
      //                       let col = 0xff;
      //
      //                       newfile.data[idx] = col;
      //                       newfile.data[idx + 1] = col;
      //                       newfile.data[idx + 2] = col;
      //                       newfile.data[idx + 3] = 0xff;
      //                     }
      //                   }
      //                   afterImg = newfile
      //                     .pack()
      //                     //.pipe(fs.createWriteStream(__dirname + "/newfile.png"))
      //                     .on("finish", function () {
      //                       console.log("Written!");
      //                     });
      //                   //console.log("r", r)
      //                 }
      //                 console.log("sizes: ", beforeImg.width, afterImg.width, beforeImg.height, afterImg.height)
      //
      //                 if (beforeImg.width === afterImg.width && beforeImg.height === afterImg.height) {
      //                   //const d = new PNG({width, height});
      //                   const canvas: HTMLCanvasElement | null = document.getElementById("diffCanvas") as HTMLCanvasElement
      //                   if (canvas) {
      //                     canvas.height = height
      //                     canvas.width = width
      //                     const ctx = canvas.getContext("2d");
      //                     //const imgData = ctx?.createImageData(100, 100);
      //                     const d: ImageData | undefined = ctx?.createImageData(width, height);
      //                     if (d) {
      //                       const numDiffPixels = pixelmatch(beforeImg.data, afterImg.data, d.data, width, height, {
      //                         threshold: 0.1,
      //                       });
      //                       ctx?.putImageData(d, 0, 0)
      //                       console.log("###", numDiffPixels);
      //                     }
      //
      //                   }
      //                 }
      //
      //               })
      //           })
      //
      //       }
      //     }
      //   }
      // }
      return 'chrome-extension://pndffocijjfpmphlhkoijmpfckjafdpl/www/index.html#/mainpanel/mhtml/7b961cb4-243f-430a-b28e-0e9421febdc2'
    }
  }
})

const closeWindow = () => window.close()

const applySuggestion = () => {
  if (suggestion.value) {
    useCommandExecutor()
      .executeFromUi(new ApplySuggestionCommand(suggestion.value), NotificationType.NOTIFY)
      .then(() => (decided.value = true))
  }
}

const ignoreSuggestion = () => {
  if (suggestion.value) {
    useCommandExecutor()
      .executeFromUi(new IgnoreSuggestionCommand(suggestion.value))
      .then(() => (decided.value = true))
  }
}
</script>
