"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { resetDemoDataAction, saveSettingsAction } from "@/app/admin/actions/settings";
import { centsToInput } from "@/lib/admin/format";
import { shippingMethodLabels } from "@/lib/admin/order-status";
import type { ShippingMethod, StoreSettings } from "@/lib/admin/types";
import { ConfirmDialog } from "./confirm-dialog";
import { useToast } from "./toast";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const rateKeys: ShippingMethod[] = ["econt_office", "econt_address", "speedy_office", "speedy_address", "pickup"];

export function SettingsForm({ settings }: { settings: StoreSettings }) {
  const { push } = useToast();
  const [state, action, pending] = useActionState(saveSettingsAction, null);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetting, startReset] = useTransition();
  const errors = state?.fieldErrors ?? {};

  useEffect(() => {
    if (state) push(state.message, state.ok ? "success" : "error");
  }, [state, push]);

  const money = (name: string, label: string, value: number, hint?: string) => (
    <div className="a-field">
      <Label htmlFor={name}>{label}</Label>
      <div className="a-input-affix">
        <Input
          aria-describedby={errors[name] ? `${name}-error` : undefined}
          aria-invalid={Boolean(errors[name])}
          
          defaultValue={centsToInput(value)}
          id={name}
          inputMode="decimal"
          name={name}
        />
        <span>€</span>
      </div>
      {hint ? <p className="a-muted">{hint}</p> : null}
      {errors[name] ? (
        <p className="a-field__error" id={`${name}-error`}>
          {errors[name]}
        </p>
      ) : null}
    </div>
  );

  return (
    <>
      <form action={action} className="a-stack a-stack--lg">
        <Card className="gap-4 p-5">
          <CardTitle className="font-serif text-xl font-medium">Цени</CardTitle>
          <div className="a-grid a-grid--2">
            {money("goldSurcharge", "Надценка за злато", settings.goldSurchargeCents, "Добавя се към цената в сребро за златните варианти.")}
            {money("freeShippingThreshold", "Безплатна доставка над", settings.freeShippingThresholdCents)}
          </div>
        </Card>

        <Card className="gap-4 p-5">
          <CardTitle className="font-serif text-xl font-medium">Цени за доставка</CardTitle>
          <div className="a-grid a-grid--3">
            {rateKeys.map((key) => money(`rate_${key}`, shippingMethodLabels[key], settings.shippingRates[key]))}
          </div>
        </Card>

        <Card className="gap-4 p-5">
          <CardTitle className="font-serif text-xl font-medium">Известия</CardTitle>
          <div className="a-field">
            <Label htmlFor="orderNotifyEmail">Имейл за известия за поръчки</Label>
            <Input
              aria-invalid={Boolean(errors.orderNotifyEmail)}
              
              defaultValue={settings.orderNotifyEmail}
              id="orderNotifyEmail"
              name="orderNotifyEmail"
              type="email"
            />
            {errors.orderNotifyEmail ? <p className="a-field__error">{errors.orderNotifyEmail}</p> : null}
          </div>
          <Label className="flex items-center gap-2">
            <Checkbox defaultChecked={settings.lowStockEmail} name="lowStockEmail" />
            Изпращай имейл, когато наличност падне под прага
          </Label>
        </Card>

        <div className="a-row">
          <Button variant="default" disabled={pending} type="submit">
            {pending ? "Запазване…" : "Запази настройките"}
          </Button>
        </div>
      </form>

      <Card className="gap-4 border-dashed bg-sunken p-5">
        <CardTitle className="font-serif text-xl font-medium">Демо данни</CardTitle>
        <p className="a-muted">Връща всички поръчки, продукти и наличности към началното състояние. Данните така или иначе се нулират при рестарт на сървъра.</p>
        <div>
          <Button variant="outline" onClick={() => setResetOpen(true)} type="button">
            Нулирай демо данните
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        confirmLabel="Нулирай"
        danger
        description="Всички промени, направени в демото, ще бъдат загубени."
        onCancel={() => setResetOpen(false)}
        onConfirm={() =>
          startReset(async () => {
            const result = await resetDemoDataAction();
            push(result.message, result.ok ? "success" : "error");
            setResetOpen(false);
          })
        }
        open={resetOpen}
        pending={resetting}
        title="Да нулираме ли демо данните?"
      />
    </>
  );
}
