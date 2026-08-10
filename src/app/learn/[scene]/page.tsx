import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhraseTrainer } from "@/components/PhraseTrainer";
import {
  getPhrasesByScene,
  getSceneMeta,
  isValidScene,
} from "@/lib/phrases";
import { SCENES } from "@/lib/types";

type Props = {
  params: Promise<{ scene: string }>;
};

export function generateStaticParams() {
  return SCENES.map((scene) => ({ scene: scene.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { scene } = await params;
  if (!isValidScene(scene)) return { title: "Scene" };
  const meta = getSceneMeta(scene);
  return {
    title: meta?.title ?? "Scene",
    description: meta?.blurb,
  };
}

export default async function ScenePage({ params }: Props) {
  const { scene } = await params;
  if (!isValidScene(scene)) notFound();

  const meta = getSceneMeta(scene);
  const phrases = getPhrasesByScene(scene);

  return (
    <PhraseTrainer sceneTitle={meta?.title ?? scene} phrases={phrases} />
  );
}
