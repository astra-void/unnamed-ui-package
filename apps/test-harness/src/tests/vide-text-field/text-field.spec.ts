import { Vide } from "@lattice-ui/vide-runtime";
import { TextField } from "@lattice-ui/vide-text-field";
import { readProperty } from "../../test-utils/videHarness";

function renderField(props: { value?: Vide.Source<string>; readOnly?: boolean; disabled?: boolean }) {
  return Vide.root(() => {
    let input: TextBox | undefined;

    TextField.Root({
      value: props.value,
      readOnly: props.readOnly,
      disabled: props.disabled,
      children: () => {
        input = TextField.Input({}) as TextBox;
        return input;
      },
    });

    return input as TextBox;
  });
}

export = () => {
  describe("vide text field", () => {
    it("binds the input's text to a controlled value", () => {
      const value = Vide.source("astra");
      const [destroy, input] = renderField({ value });

      assert(readProperty(() => input.Text) === "astra", "The input starts on the controlled value.");

      value("void");
      assert(readProperty(() => input.Text) === "void", "Changing the value should reach the input.");

      destroy();
    });

    it("writes a read-only value back over an edit", () => {
      const value = Vide.source("lat_live_4f9c2b7e");
      const [destroy, input] = renderField({ value, readOnly: true });

      // The engine lets a player type into a TextBox regardless; read-only is the core putting its
      // own value back, which is the whole behaviour worth testing here.
      input.Text = "tampered";
      task.wait();

      assert(readProperty(() => input.Text) === "lat_live_4f9c2b7e", "A read-only field restores its value.");

      destroy();
    });

    it("takes a disabled field out of the editable flow", () => {
      const [destroy, input] = renderField({ disabled: true });

      assert(!readProperty(() => input.TextEditable), "A disabled field is not editable.");
      assert(!readProperty(() => input.Selectable), "…and is not reachable by selection.");

      destroy();
    });
  });
};
