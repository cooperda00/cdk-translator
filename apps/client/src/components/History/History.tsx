import React, { FC } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui";
import { match, P } from "ts-pattern";
import { ArrowRight, Trash2 } from "lucide-react";
import languageCodes from "iso-639-1";
import { formatDate } from "@/lib";
import { useHistory } from "./useHistory";

type Props = {
  className?: string;
};

export const History: FC<Props> = ({ className }) => {
  const { deleteTranslation, historyQueryRes } = useHistory();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={className} variant={"link"}>
          History
        </Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col">
        <DialogHeader>
          <DialogTitle>History</DialogTitle>
          <DialogDescription>
            View and/or delete your translation history
          </DialogDescription>
        </DialogHeader>

        {match(historyQueryRes)
          .with({ error: P.not(P.nullish) }, ({ error }) => (
            <p>An error has occurred: {error.message}</p>
          ))
          .with({ isPending: true }, () => <p>Loading</p>)
          .with(
            { data: { data: { translations: P.not(P.nullish) } } },
            ({
              data: {
                data: { translations },
              },
            }) => {
              return (
                <div className="flex-1 flex flex-col gap-4 overflow-auto">
                  {translations.length ? (
                    translations.map((translation) => (
                      <Card key={translation.requestId} className="relative">
                        <Button
                          variant={"ghost"}
                          className="p-1 mt-0 absolute top-4 right-4"
                          onClick={() => {
                            deleteTranslation(translation.requestId);
                          }}
                        >
                          <Trash2 className="h-5" />
                        </Button>

                        <CardHeader>
                          <span className={"flex gap-2"}>
                            {languageCodes.getName(translation.sourceLang)}
                            <ArrowRight />
                            {languageCodes.getName(translation.targetLang)}
                          </span>
                          <span>{formatDate(translation.timestamp)}</span>
                        </CardHeader>

                        <CardContent className="flex flex-col gap-2">
                          <p>{translation.text}</p>
                          <p>{translation.translation}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="italic w-full text-center text-sm">
                      No translations to show
                    </p>
                  )}
                </div>
              );
            }
          )
          .otherwise(() => (
            <p className="italic w-full text-center text-sm">
              No translations to show
            </p>
          ))}
      </DialogContent>
    </Dialog>
  );
};
