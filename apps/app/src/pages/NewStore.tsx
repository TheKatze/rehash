import { useRehash } from "@/providers/RehashProvider";
import { ReButton, ReCard, ReForm, ReSkeleton, ReTextField } from "@/ui";
import { useNavigate } from "solid-app-router";
import {
  Component,
  createDeferred,
  createSignal,
  lazy,
  Suspense,
} from "solid-js";

const NewStore: Component = () => {
  const [generator, entries, store] = useRehash();
  const navigate = useNavigate();
  const [password, setPassword] = createSignal("");

  async function createNewStore() {
    await store.initialize(password());
    await store.create({ iterations: 15, memorySize: 2048, parallelism: 2 });

    navigate("/");
  }

  const PasswordStrengthMeter = lazy(
    async () => await import("@/components/PasswordStrengthMeter")
  );

  return (
    <div>
      <ReCard>
        <h2 className="text-xl font-bold">New Store</h2>
        <p>Set a strong master password for your new store.</p>
        <ReForm onSubmit={createNewStore}>
          <ReTextField
            onInput={(e) => setPassword(e.currentTarget.value)}
            label="Password"
            password
          />
          <Suspense
            fallback={
              <div className="w-44 h-8 mb-5">
                <ReSkeleton />
              </div>
            }
          >
            <PasswordStrengthMeter password={password} />
          </Suspense>
          <ReButton submit> Create new Store </ReButton>
        </ReForm>
      </ReCard>
    </div>
  );
};

export default NewStore;
