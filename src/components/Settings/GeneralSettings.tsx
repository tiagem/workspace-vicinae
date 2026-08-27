import { Action, ActionPanel, Color, Icon, List, showToast, Toast, type Application } from "@vicinae/api";

import ImportSettingsForm from "@/components/ImportSettingsForm";
import SelectEditor from "@/components/SelectEditor";
import { App } from "@/types";
import { toApp } from "@/utils/validation";

interface GeneralSettingsProps {
  defaultApp: App | null;
  onExportSettings: () => Promise<void>;
  onImportSettings: (filePath: string) => Promise<boolean>;
  terminalApp: App | null;
  updateDefaultApp: (app: App | null) => Promise<void>;
  updateTerminalApp: (app: App | null) => Promise<void>;
}

export default function GeneralSettings({
  defaultApp,
  onExportSettings,
  onImportSettings,
  terminalApp,
  updateDefaultApp,
  updateTerminalApp,
}: GeneralSettingsProps) {
  const handleDefaultAppSelect = async (app: Application) => {
    await updateDefaultApp(toApp(app));
    await showToast({ message: app.name, style: Toast.Style.Success, title: "App Updated" });
  };

  const handleTerminalSelect = async (app: Application) => {
    await updateTerminalApp(toApp(app));
    await showToast({ message: app.name, style: Toast.Style.Success, title: "Terminal Updated" });
  };

  const handleTerminalReset = async () => {
    await updateTerminalApp(null);
    await showToast({ style: Toast.Style.Success, title: "Terminal Reset" });
  };

  return (
    <List.Section title="General Settings">
      <List.Item
        accessories={[
          {
            tag: {
              color: defaultApp?.name ? Color.SecondaryText : Color.Red,
              value: defaultApp?.name || "Not selected",
            },
          },
        ]}
        actions={
          <ActionPanel>
            <ActionPanel.Section title="Application">
              <Action.Push
                icon={Icon.Pencil}
                target={<SelectEditor onSelect={handleDefaultAppSelect} />}
                title="Change Application"
              />
            </ActionPanel.Section>
          </ActionPanel>
        }
        icon={Icon.AppWindow}
        subtitle="Application where your projects are opened"
        title="Default App"
      />
      <List.Item
        accessories={[
          {
            tag: {
              color: Color.SecondaryText,
              value: terminalApp?.name || "System default",
            },
          },
        ]}
        actions={
          <ActionPanel>
            <ActionPanel.Section title="Terminal">
              <Action.Push
                icon={Icon.Pencil}
                target={<SelectEditor onReset={handleTerminalReset} onSelect={handleTerminalSelect} />}
                title="Change Terminal"
              />
            </ActionPanel.Section>
          </ActionPanel>
        }
        icon={Icon.Terminal}
        subtitle="Open your projects in a terminal. If unset, Vicinae uses the system default."
        title="Terminal App"
      />
      <List.Item
        actions={
          <ActionPanel>
            <ActionPanel.Section title="Backup">
              <Action icon={Icon.Download} onAction={onExportSettings} title="Export Settings to Downloads" />
              <Action.Push
                icon={Icon.Upload}
                target={<ImportSettingsForm onImport={onImportSettings} />}
                title="Import Settings File"
              />
            </ActionPanel.Section>
          </ActionPanel>
        }
        icon={Icon.BlankDocument}
        subtitle="Export current settings or import from a JSON backup file"
        title="Import / Export Settings"
      />
    </List.Section>
  );
}
