import { cn } from "~/lib/utils";

export {
  BiAward as Award,
  BiCheck as Check,
  BiCheckCircle as CheckCircle,
  BiChevronRight as ChevronRight,
  BiChevronLeft as ChevronLeft,
  BiDotsHorizontalRounded as Dots,
  BiEdit as Edit,
  BiErrorCircle as ErrorCircle,
  BiHomeAlt2 as Home,
  BiInfoCircle as Info,
  BiLaptop as Laptop,
  BiLogoDiscord as Discord,
  BiLogoGoogle as Google,
  BiLogoTwitch as Twitch,
  BiMessageSquareDots as Message,
  BiMessageSquareEdit as EditMessage,
  BiMoon as Moon,
  BiPalette as Palette,
  BiSave as Save,
  BiSearch as Search,
  BiSun as Sun,
  BiTrashAlt as Trash,
  BiUser as User,
  BiX as X,
} from "react-icons/bi";

export function W({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      color="currentColor"
      fill="currentColor"
      className={cn("size-[1em]", className)}
      {...props}
    >
      <path d="M3.42796 8.53937C3.19027 7.70022 3.66793 6.82519 4.5023 6.57125V6.57125C5.36264 6.3094 6.26983 6.80729 6.51098 7.67365L7.74373 12.1024C7.96463 12.896 8.95495 13.1631 9.54489 12.5881V12.5881C10.2318 11.9187 11.3858 12.4054 11.3858 13.3645V14.4088C11.3858 14.8132 11.2251 15.201 10.9392 15.4869L9.17649 17.2496C8.77849 17.6476 8.23869 17.8712 7.67583 17.8712V17.8712C6.72649 17.8712 5.89263 17.2407 5.63391 16.3273L3.42796 8.53937ZM18.6456 16.1322C18.3808 17.156 17.4571 17.8712 16.3996 17.8712V17.8712C15.7882 17.8712 15.2014 17.6298 14.767 17.1994L13.0318 15.4805C12.7475 15.1988 12.5875 14.8152 12.5875 14.415V13.2953C12.5875 12.3723 13.7035 11.91 14.3562 12.5627V12.5627C14.9275 13.134 15.9039 12.8606 16.0954 12.0757L17.1239 7.86022C17.3601 6.89204 18.3479 6.30891 19.3097 6.56987V6.56987C20.2465 6.82402 20.8045 7.78437 20.5615 8.72405L18.6456 16.1322Z" />
    </svg>
  );
}
