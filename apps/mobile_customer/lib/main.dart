import 'package:tsumi_kit/tsumi_kit.dart';

import 'router.dart';

void main() => runTsumiApp(
      title: 'Tsumi',
      storagePrefix: 'tsumi_customer',
      requiredType: 'customer',
      wrongTypeMessage: 'This is the customer app. Agents use the Tsumi Agent app.',
      router: buildRouter,
    );
