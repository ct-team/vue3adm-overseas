import { ComponentInternalInstance, getCurrentInstance } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
export default function useCommon(): any {
  const { appContext } = getCurrentInstance() as ComponentInternalInstance;
  const proxy = appContext.config.globalProperties;

  const store = useStore();
  const router = useRouter();
  const route = useRoute();
  return { proxy, store, router, route };
}
