import 'package:url_launcher/url_launcher.dart';

Future<bool> callPhone(String phone) => launchUrl(Uri(scheme: 'tel', path: phone));

/// Directions for a free-text address in the phone's maps app.
Future<bool> openMaps(String address) => launchUrl(
      Uri.https('www.google.com', '/maps/search/', {'api': '1', 'query': '$address, Ghana'}),
      mode: LaunchMode.externalApplication,
    );

/// Paystack checkout. An in-app browser keeps the user close to the app.
Future<bool> openCheckout(String url) => launchUrl(Uri.parse(url), mode: LaunchMode.inAppBrowserView);

Future<bool> openEmail(String address) => launchUrl(Uri(scheme: 'mailto', path: address));
