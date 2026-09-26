import 'package:tsumi_kit/tsumi_kit.dart';

import 'router.dart';

void main() => runTsumiApp(
      title: 'Tsumi',
      storagePrefix: 'tsumi_customer',
      requiredType: 'customer',
      wrongTypeMessage: 'This is the customer app. Runners use the Tsumi Runner app.',
      router: buildRouter,
    );
