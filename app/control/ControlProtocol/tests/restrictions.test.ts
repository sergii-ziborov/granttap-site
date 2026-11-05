import { expect, it } from 'vitest';
import { Payload } from '..';
import { applyControlPayload, emptyComputer } from '../../ControlState';

it('keeps a Project snapshot when the computer reports new scoped coding guidance', () => {
  const input = { type: 'mesh.snapshot', sessionId: 'demo', projectId: 'demo', publisherEndpointId: 'demo-mac',
    project: { projectId: 'demo', name: 'GrantTap Lab', canonicalRepositoryId: 'fixture/demo', createdAt: 1 },
    tasks: [], executions: [], claims: [], dependencies: [], events: [], generatedAt: 2,
    restrictions: { projectId: 'demo', revision: 1, scope: 'project', source: 'phone', rules: [],
      guidance: { principles: ['behavior_tests'], architecture: 'hexagonal', markdown: '## Fixture only\n' } },
  };
  const parsed = Payload.safeParse(input);
  expect(parsed.success).toBe(true);
  if (!parsed.success) return;
  const next = applyControlPayload(emptyComputer(), parsed.data);
  expect(next.meshes).toHaveLength(1);
  expect(next.meshes[0].project.name).toBe('GrantTap Lab');
  expect(JSON.stringify(next.meshes[0].restrictions)).toContain('## Fixture only\\n');
});
