import React, { Suspense } from "react";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { MarketplaceAppProvider } from "../../common/providers/MarketplaceAppProvider";
import { Route, Routes } from "react-router-dom";
import { EntrySidebarExtensionProvider } from "../../common/providers/EntrySidebarExtensionProvider";
import { AppConfigurationExtensionProvider } from "../../common/providers/AppConfigurationExtensionProvider";
import { CustomFieldExtensionProvider } from "../../common/providers/CustomFieldExtensionProvider";

/**
 * All the routes are Lazy loaded.
 * This will ensure the bundle contains only the core code and respective route bundle
 * improving the page load time
 */
const Metspo = React.lazy(() => import("../CustomField/Metspo"));
const Dropdown = React.lazy(() => import("../CustomField/Dropdown"));
const LocalizedDropdown = React.lazy(() => import("../CustomField/LocalizedDropdown"));
const CatchAll = React.lazy(() => import("../CustomField/CatchAll"));
const CustomFieldExtension = React.lazy(() => import("../CustomField/CustomField"));
const EntrySidebarExtension = React.lazy(() => import("../SidebarWidget/EntrySidebar"));
const AppConfigurationExtension = React.lazy(() => import("../ConfigScreen/AppConfiguration"));
const AssetSidebarExtension = React.lazy(() => import("../AssetSidebarWidget/AssetSidebar"));
const StackDashboardExtension = React.lazy(() => import("../DashboardWidget/StackDashboard"));
const EntrySidebarExtensionMLang = React.lazy(() => import("../SidebarWidget/EntrySidebarMLang"));
const PageNotFound = React.lazy(() => import("../404/404"));
const DefaultPage = React.lazy(() => import("../index"));

function App() {
  return (
    <ErrorBoundary>
      <MarketplaceAppProvider>
        <Routes>
          <Route path="/" element={<DefaultPage />} />
          <Route
            path="/metspo"
            element={
              <Suspense>
                <CustomFieldExtensionProvider>
                  <Metspo />
                </CustomFieldExtensionProvider>
              </Suspense>
            }
          />
          <Route
            path="/dropdown"
            element={
              <Suspense>
                <CustomFieldExtensionProvider>
                  <Dropdown />
                </CustomFieldExtensionProvider>
              </Suspense>
            }
          />
          <Route
            path="/localizeddropdown"
            element={
              <Suspense>
                <CustomFieldExtensionProvider>
                  <LocalizedDropdown />
                </CustomFieldExtensionProvider>
              </Suspense>
            }
          />
          <Route
            path="/custom-field"
            element={
              <Suspense>
                <CustomFieldExtensionProvider>
                  <CustomFieldExtension />
                </CustomFieldExtensionProvider>
              </Suspense>
            }
          />
          <Route
            path="/entry-sidebar"
            element={
              <Suspense>
                <EntrySidebarExtensionProvider>
                  <EntrySidebarExtension />
                </EntrySidebarExtensionProvider>
              </Suspense>
            }
          />
          <Route
            path="/catchall"
            element={
              <Suspense>
                <EntrySidebarExtensionProvider>
                  <CatchAll />
                </EntrySidebarExtensionProvider>
              </Suspense>
            }
          />
          <Route
            path="/sidebar-mlang"
            element={
              <Suspense>
                <EntrySidebarExtensionProvider>
                  <EntrySidebarExtensionMLang />
                </EntrySidebarExtensionProvider>
              </Suspense>
            }
          />
          <Route
            path="/app-configuration"
            element={
              <Suspense>
                <AppConfigurationExtensionProvider>
                  <AppConfigurationExtension />
                </AppConfigurationExtensionProvider>
              </Suspense>
            }
          />
          <Route
            path="/asset-sidebar"
            element={
              <Suspense>
                <AssetSidebarExtension />
              </Suspense>
            }
          />
          <Route
            path="/stack-dashboard"
            element={
              <Suspense>
                <StackDashboardExtension />
              </Suspense>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </MarketplaceAppProvider>
    </ErrorBoundary>
  );
}

export default App;
