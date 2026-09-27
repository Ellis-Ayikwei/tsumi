import 'package:url_launcher/url_launcher.dart';

import 'api/models.dart';

Future<bool> callPhone(String phone) => launchUrl(Uri(scheme: 'tel', path: phone));

/// Directions in the phone's maps app: turn-by-turn to the exact pin when the
/// customer dropped one, otherwise a search for the typed address.
Future<bool> openMaps(String address, [GeoPoint? point]) => launchUrl(
      point != null
          ? Uri.https('www.google.com', '/maps/dir/', {'api': '1', 'destination': '${point.lat},${point.lng}'})
          : Uri.https('www.google.com', '/maps/search/', {'api': '1', 'query': '$address, Ghana'}),
      mode: LaunchMode.externalApplication,
    );

/// Directions through every stop in order, starting from the runner.
Future<bool> openRoute(List<ErrandStop> stops) {
  String point(ErrandStop s) => s.point != null ? '${s.point!.lat},${s.point!.lng}' : '${s.address}, Ghana';
  return launchUrl(
    Uri.https('www.google.com', '/maps/dir/', {
      'api': '1',
      'destination': point(stops.last),
      if (stops.length > 1) 'waypoints': stops.sublist(0, stops.length - 1).map(point).join('|'),
    }),
    mode: LaunchMode.externalApplication,
  );
}

/// Paystack checkout. An in-app browser keeps the user close to the app.
Future<bool> openCheckout(String url) => launchUrl(Uri.parse(url), mode: LaunchMode.inAppBrowserView);

Future<bool> openEmail(String address) => launchUrl(Uri(scheme: 'mailto', path: address));
