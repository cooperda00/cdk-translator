import { getTranslations, deleteTranslation } from "@/lib";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useHistory = () => {
  const historyQueryRes = useQuery({
    queryKey: ["translations"],
    queryFn: getTranslations,
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteTranslation,
    onSuccess({ data }) {
      queryClient.setQueryData(["translations"], (res: any) => {
        const prevTranslations = res.data.translations;
        if (Array.isArray(prevTranslations)) {
          return prevTranslations.filter(
            (translation) => translation.requestId !== data.deletedRequestId
          );
        }
      });
    },
  });

  return {
    historyQueryRes,
    deleteTranslation: mutate,
  };
};
