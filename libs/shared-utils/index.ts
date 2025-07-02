import { Document } from '@collaborative-editor/shared-types';

export function sampleFunction(): string {
  return 'Shared utility function';
}

export function updateDocument(doc: Document): Document {
  return { ...doc, lastModified: new Date() };
}
