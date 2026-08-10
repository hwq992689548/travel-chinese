import phrasesData from "../../content/phrases.json";
import {
  SCENES,
  type Phrase,
  type PhrasesFile,
  type SceneId,
} from "./types";

const data = phrasesData as PhrasesFile;

export function getAllPhrases(): Phrase[] {
  return data.phrases;
}

export function getPhrasesByScene(scene: SceneId): Phrase[] {
  return data.phrases
    .filter((p) => p.scene === scene)
    .sort((a, b) => a.order - b.order);
}

export function getPhraseById(id: string): Phrase | undefined {
  return data.phrases.find((p) => p.id === id);
}

export function getSceneMeta(scene: SceneId) {
  return SCENES.find((s) => s.id === scene);
}

export function isValidScene(value: string): value is SceneId {
  return SCENES.some((s) => s.id === value);
}

export function getFreeCount() {
  return data.phrases.filter((p) => p.free).length;
}

export function getTotalCount() {
  return data.phrases.length;
}
