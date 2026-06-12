import { createApp } from '@backstage/frontend-defaults';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import { navModule } from './modules/nav';
import { githubAuthApiRef } from '@backstage/core-plugin-api';
import { SignInPageBlueprint } from '@backstage/plugin-app-react';
import { SignInPage } from '@backstage/core-components';
import { createFrontendModule, createExtension, coreExtensionData } from '@backstage/frontend-plugin-api';
import { techDocsReportIssueAddonModule } from '@backstage/plugin-techdocs-module-addons-contrib/alpha';
import githubActionsPlugin from '@backstage-community/plugin-github-actions/alpha';
//import { prometheusPlugin } from '@roadiehq/backstage-plugin-prometheus/alpha';
import grafanaPlugin from '@backstage-community/plugin-grafana/alpha';
//import { EntityPrometheusContent } from '@roadiehq/backstage-plugin-prometheus';
import { EntityPrometheusContent } from '@roadiehq/backstage-plugin-prometheus';

const signInPage = SignInPageBlueprint.make({
  params: {
    loader: async () => props =>
      (
        <SignInPage
          {...props}
          provider={{
            id: 'github-auth-provider',
            title: 'GitHub',
            message: 'Sign in using GitHub',
            apiRef: githubAuthApiRef,
          }}
        />
      ),
  },
});


const prometheusTabExtension = createExtension({
  id: 'catalog.prometheus-tab',
  attachTo: { id: 'catalog:page/entity', input: 'contents' },
  output: {
    element: coreExtensionData.reactElement,
    path: coreExtensionData.routePath.optional(),
    title: coreExtensionData.string.optional(),
  },
  factory: () => ({
    element: <EntityPrometheusContent />,
    path: '/prometheus',
    title: 'Metrics',
  }),
});

const customPrometheusModule = createFrontendModule({
  pluginId: 'catalog', 
  extensions: [prometheusTabExtension],
});

export default createApp({
  features: [
    catalogPlugin,
    techDocsReportIssueAddonModule,
    navModule,
//    prometheusPlugin,
    customPrometheusModule,
    grafanaPlugin,
    githubActionsPlugin,
    createFrontendModule({
      pluginId: 'app',
      extensions: [signInPage],
    }),
  ],
});
