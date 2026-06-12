import { createApp } from '@backstage/frontend-defaults';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import { navModule } from './modules/nav';
import { githubAuthApiRef } from '@backstage/core-plugin-api';
import { SignInPageBlueprint } from '@backstage/plugin-app-react';
import { SignInPage } from '@backstage/core-components';
import { createFrontendModule, createExtension } from '@backstage/frontend-plugin-api';
import { techDocsReportIssueAddonModule } from '@backstage/plugin-techdocs-module-addons-contrib/alpha';
import githubActionsPlugin from '@backstage-community/plugin-github-actions/alpha';
//import { prometheusPlugin } from '@roadiehq/backstage-plugin-prometheus/alpha';
import grafanaPlugin from '@backstage-community/plugin-grafana/alpha';
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


const customPrometheusModule = createFrontendModule({
  pluginId: 'catalog', 
  extensions: [
    createExtension({
      id: 'catalog.prometheus-tab',
      // Switch target to catalog entity content pages explicitly
      attachTo: { id: 'catalog:page/entity', input: 'contents' },
      output: {},
      factory: () => ({
        element: <EntityPrometheusContent />,
      }),
    } as any)
  ],
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
