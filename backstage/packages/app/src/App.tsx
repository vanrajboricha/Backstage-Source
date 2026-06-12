import { createApp } from '@backstage/frontend-defaults';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import { navModule } from './modules/nav';
import { githubAuthApiRef } from '@backstage/core-plugin-api';
import { SignInPageBlueprint } from '@backstage/plugin-app-react';
import { SignInPage } from '@backstage/core-components';
import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { techDocsReportIssueAddonModule } from '@backstage/plugin-techdocs-module-addons-contrib/alpha';
import githubActionsPlugin from '@backstage-community/plugin-github-actions/alpha';
//import { prometheusPlugin } from '@roadiehq/backstage-plugin-prometheus/alpha';
import grafanaPlugin from '@backstage-community/plugin-grafana/alpha';

import { EntityPrometheusContent, EntityPrometheusAlertCard } from '@roadiehq/backstage-plugin-prometheus';

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

const prometheusTabExtension = EntityContentBlueprint.make({
  name: 'prometheus-tab',
  params: {
    path: '/prometheus',
    title: 'Metrics',
    loader: async () => <EntityPrometheusContent />,
  },
});

// 3. Optional: Wrap the Prometheus Alert Card into an Overview Card Extension
const prometheusAlertCardExtension = EntityCardBlueprint.make({
  name: 'prometheus-alert-card',
  params: {
    loader: async () => <EntityPrometheusAlertCard />,
  },
});

// 4. Combine the extensions into a declarative module bound to the Catalog Plugin
const customPrometheusModule = createFrontendModule({
  pluginId: 'catalog', 
  extensions: [prometheusTabExtension, prometheusAlertCardExtension],
});

export default createApp({
  features: [
    catalogPlugin,
    techDocsReportIssueAddonModule,
    navModule,
//    prometheusPlugin,
    grafanaPlugin,
    githubActionsPlugin,
    createFrontendModule({
      pluginId: 'app',
      extensions: [signInPage],
    }),
  ],
});
