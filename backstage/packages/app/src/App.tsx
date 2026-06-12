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
import argocdPlugin from '@roadiehq/backstage-plugin-argo-cd/alpha';

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


// Configure the Prometheus extension with explicit array types matching your types
const prometheusTabExtension = createExtension({
  id: 'catalog.prometheus-tab',
  attachTo: { id: 'catalog:page/entity', input: 'contents' },
  // 1. Output must be declared as an array in your version
  output: [
    coreExtensionData.reactElement,
    coreExtensionData.routePath.optional(),
    coreExtensionData.title.optional(), // Fixed from .string to .title
  ],
  // 2. Bypassing internal return type iterables strictly via array layout mappings
  factory: () => [
    coreExtensionData.reactElement(<EntityPrometheusContent />),
    coreExtensionData.routePath('/prometheus'),
    coreExtensionData.title('Metrics'),
  ],
} as any); // Cast handles remaining framework version variances across setups cleanly


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
    argocdPlugin,
    githubActionsPlugin,
    createFrontendModule({
      pluginId: 'app',
      extensions: [signInPage],
    }),
  ],
});
