import { useI18n } from "@/i18n/I18nProvider";
import { useRehash } from "@/providers/RehashProvider";
import { useToasts } from "@/ui/app/ToastProvider";
import { StoreEntryWithId } from "@rehash/logic";
import { Link } from "solid-app-router";
import { Component, createSignal, Show } from "solid-js";

import IconClipboard from "~icons/majesticons/clipboard-copy-line";
import IconUser from "~icons/majesticons/user-line";

interface EntryListItemProps {
  entry: StoreEntryWithId;
}

const EntryListItem: Component<EntryListItemProps> = (props) => {
  const [generator, entries, store] = useRehash();
  const [toast] = useToasts();
  const [t] = useI18n();

  const title = props.entry.displayName ?? props.entry.url;
  const [loading, setLoading] = createSignal(false);

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  async function copyPassword() {
    setLoading(true);
    const password = await generator.generate(props.entry);
    copyToClipboard(password);
    setLoading(false);
    toast(t("COPIED_PASSWORD"), "info");
  }

  function copyUsername() {
    copyToClipboard(props.entry.username);
    toast(t("COPIED_USERNAME"), "info");
  }

  return (
    <ul className="bg-surface hover:bg-overlay rounded dark:(bg-dark-surface hover:bg-dark-overlay) p-3 relative flex flex-row my-2 dark-transition">
      <Link
        href={`/entry/${props.entry.id}`}
        className="no-underline flex-grow"
      >
        <div>
          <h3 className="font-bold text-2xl text-text dark:(text-dark-text)">
            {title}
          </h3>
          <span className="text-muted dark:(text-dark-muted)">
            {props.entry.username}
          </span>
        </div>
      </Link>
      <div className="place-self-center text-2xl">
        <IconUser
          onClick={copyUsername}
          className="cursor-pointer origin-center hover:text-iris dark:hover:text-dark-iris transition-colors"
        />
        <IconClipboard
          onClick={copyPassword}
          className="cursor-pointer origin-center hover:text-iris dark:hover:text-dark-iris transition-colors"
        />
      </div>
      <Show when={loading()}>
        <div className="bg-gradient-to-r from-love to-rose dark:(from-dark-love to-dark-rose) absolute animate-pulse w-full bottom-0 -mx-3 h-1"></div>
      </Show>
    </ul>
  );
};

export default EntryListItem;
