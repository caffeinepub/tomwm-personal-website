import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { PageContent, Essay, ContactInfo, UserProfile } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
    },
    enabled: !!actor && !isFetching && !!identity,
    retry: false,
  });
}

// Page Content Queries
export function useGetPageContent(page: string) {
  const { actor, isFetching } = useActor();

  return useQuery<PageContent | null>({
    queryKey: ['pageContent', page],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getPageContent(page);
      } catch (error) {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdatePageContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ page, content }: { page: string; content: PageContent }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePageContent(page, content);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pageContent', variables.page] });
    },
  });
}

// Essay Queries
export function useGetAllEssays() {
  const { actor, isFetching } = useActor();

  return useQuery<Essay[]>({
    queryKey: ['essays'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEssays();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFeaturedEssay() {
  const { actor, isFetching } = useActor();

  return useQuery<Essay | null>({
    queryKey: ['featuredEssay'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getFeaturedEssay();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddEssay() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (essay: { title: string; excerpt: string; tags: string[]; publicationDate: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addEssay(essay.title, essay.excerpt, essay.tags, essay.publicationDate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['essays'] });
    },
  });
}

export function useUpdateEssay() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (essay: { id: bigint; title: string; excerpt: string; tags: string[]; publicationDate: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateEssay(essay.id, essay.title, essay.excerpt, essay.tags, essay.publicationDate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['essays'] });
      queryClient.invalidateQueries({ queryKey: ['featuredEssay'] });
    },
  });
}

export function useDeleteEssay() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteEssay(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['essays'] });
      queryClient.invalidateQueries({ queryKey: ['featuredEssay'] });
    },
  });
}

export function useSetFeaturedEssay() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setFeaturedEssay(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['essays'] });
      queryClient.invalidateQueries({ queryKey: ['featuredEssay'] });
    },
  });
}

// Contact Info Queries
export function useGetContactInfo() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactInfo | null>({
    queryKey: ['contactInfo'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getContactInfo();
      } catch (error) {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateContactInfo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (info: { email: string; linkedIn: string; bluesky: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateContactInfo(info.email, info.linkedIn, info.bluesky);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactInfo'] });
    },
  });
}
