import { createApp, DefineComponent, ref, h, VNode, App, nextTick } from 'vue';
import ActionSheetVue from './action-sheet';
import { WithInstallType, isBrowser } from '../shared';

import './style';
import { TdActionSheetProps } from './type';

export * from './type';
export type ActionSheetProps = TdActionSheetProps;

let instance: any = null;
let app: App<Element>;

function create(props: Partial<TdActionSheetProps>): DefineComponent<TdActionSheetProps> {
  if (!isBrowser) return;

  const root = document.createElement('div');
  document.body.appendChild(root);

  const propsObject = {
    defaultVisible: true,
    ...props,
  };

  if (instance) {
    instance.clear();
  }

  instance = ActionSheetVue;

  instance.clear = (trigger: any) => {
    app.unmount();
    root.remove();
    if (propsObject.onClose && trigger && trigger.trigger !== 'overlay') {
      propsObject.onClose(trigger);
    }
    instance = null;
  };
  app = createApp(instance, { ...propsObject });
  app.mount(root);
  return instance;
}

function ActionSheet(props: Partial<TdActionSheetProps>) {
  return create(props);
}

ActionSheet.close = (trigger: any) => {
  if (instance) {
    instance.clear(trigger);
  }
};

ActionSheet.show = (props: Partial<TdActionSheetProps>) => {
  return create(props);
};

ActionSheet.install = (app: App, name = '') => {
  app.component(name || ActionSheetVue.name, ActionSheetVue);
};

type ActionSheetApi = {
  /** 关闭ActionSheet */
  close: () => void;
  /** 打开ActionSheet */
  show: (props: Partial<TdActionSheetProps>) => DefineComponent<TdActionSheetProps>;
};

export const _ActionSheet: WithInstallType<typeof ActionSheetVue> & ActionSheetApi = ActionSheet as any;
export default _ActionSheet;
