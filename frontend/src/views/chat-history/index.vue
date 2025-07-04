<script setup lang="ts">
import type { NScrollbar } from 'naive-ui';
import { VueMarkdownItProvider } from 'vue-markdown-shiki';
import ChatMessage from '../chat/modules/chat-message.vue';

defineOptions({
  name: 'ChatHistory'
});

const scrollbarRef = ref<InstanceType<typeof NScrollbar>>();

const list = ref<Api.Chat.Message[]>([]);
const loading = ref(false);

watch(() => [...list.value], scrollToBottom);

function scrollToBottom() {
  setTimeout(() => {
    scrollbarRef.value?.scrollBy({
      top: 999999999999999,
      behavior: 'auto'
    });
  }, 100);
}

const range = ref<[number, number]>([dayjs().subtract(7, 'day').valueOf(), Date.now()]);
const userId = ref<number | null>(null);

const params = computed(() => {
  return {
    userid: userId.value,
    start_date: dayjs(range.value[0]).format('YYYY-MM-DD'),
    end_date: dayjs(range.value[1]).format('YYYY-MM-DD')
  };
});

watchEffect(() => {
  getList();
});

async function getList() {
  if (!params.value.userid) return;
  loading.value = true;
  const { error, data } = await request<Api.Chat.Message[]>({
    url: 'admin/conversation',
    params: params.value
  });
  if (!error) {
    list.value = data;
    scrollToBottom();
  }
  loading.value = false;
}
</script>

<template>
  <div class="h-full">
    <Teleport defer to="#header-extra">
      <div class="px-10">
        <NForm :model="params" label-placement="left" :show-feedback="false" inline>
          <NFormItem label="用户">
            <TheSelect
              v-model:value="userId"
              url="admin/users/list"
              :params="{ page: 1, size: 999 }"
              select-first
              key-field="content"
              value-field="userId"
              label-field="username"
              class="clear w-200px!"
              :clearable="false"
            />
          </NFormItem>
          <NFormItem label="时间">
            <NDatePicker v-model:value="range" type="daterange" class="clear" />
          </NFormItem>
        </NForm>
      </div>
    </Teleport>
    <NScrollbar ref="scrollbarRef">
      <NSpin :show="loading" class="h-full">
        <VueMarkdownItProvider>
          <ChatMessage v-for="(item, index) in list" :key="index" :msg="item" />
        </VueMarkdownItProvider>
        <NEmpty v-if="!list.length" description="暂无数据" class="mt-60" />
      </NSpin>
    </NScrollbar>
  </div>
</template>

<style scoped lang="scss"></style>
