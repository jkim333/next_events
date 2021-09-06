import MainHeader from "./main-header";
import { Fragment, useContext } from "react";
import Notification from "../ui/notification";
import NotificationContext from "../../store/notification-context";

function Layout(props) {
  const notificationCtx = useContext(NotificationContext);

  const activeNotification = notificationCtx.notification;

  return (
    <Fragment>
      <MainHeader />
      <main>
        {props.children}
        {activeNotification && (
          <Notification
            title={activeNotification.title}
            message={activeNotification.message}
            status={activeNotification.status}
          />
        )}
      </main>
    </Fragment>
  );
}

export default Layout;
